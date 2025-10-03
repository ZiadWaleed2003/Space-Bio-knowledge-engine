import axios from "axios";

export interface OSDRStudy {
    studyId: string;
    title: string;
    description: string;
    organism?: string;
    factors?: string[];
    projectType?: string;
    releaseDate?: string;
    url: string;
}

export interface OSDRSearchResult {
    total: number;
    studies: OSDRStudy[];
}

const OSDR_SEARCH_URL = "https://osdr.nasa.gov/osdr/data/search/";
const API_TIMEOUT = 10000;
const DESCRIPTION_MAX_LENGTH = 250;

/**
 * Search OSDR for space biology studies
 */
export async function searchOSDR(
    query: string,
    limit: number = 10
): Promise<OSDRSearchResult> {
    try {
        const response = await axios.get(OSDR_SEARCH_URL, {
            params: {
                term: query,
                size: limit,
                from: 0,
            },
            timeout: API_TIMEOUT,
        });

        const hits = (response.data?.hits?.hits as any[]) ?? [];

        const studies: OSDRStudy[] = hits.map((hit: any) => {
            const source = hit._source;
            return {
                studyId: source.accession ?? hit._id,
                title: source.title ?? "Untitled Study",
                description: source.description ?? "No description available",
                organism: source.organism_name,
                factors: source.study_factors ?? [],
                projectType: source.project_type,
                releaseDate: source.release_date,
                url: `https://osdr.nasa.gov/bio/repo/data/studies/${source.accession}`,
            };
        });

        return {
            total: response.data?.hits?.total?.value ?? 0,
            studies,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                throw new Error("OSDR API request timed out");
            }
            if (error.response?.status === 404) {
                return { total: 0, studies: [] };
            }
        }
        throw new Error("Failed to fetch data from OSDR");
    }
}

/**
 * Format OSDR results for LLM context
 */
export function formatOSDRForLLM(results: OSDRSearchResult): {
    contextText: string;
    sources: { title: string; url: string }[];
} {
    if (results.studies.length === 0) {
        return {
            contextText: "No relevant studies found in OSDR.",
            sources: [],
        };
    }

    const contextParts = ["=== OSDR Space Biology Studies ==="];
    const sources: { title: string; url: string }[] = [];

    results.studies.forEach((study, index) => {
        const truncatedDesc =
            study.description.length > DESCRIPTION_MAX_LENGTH
                ? `${study.description.substring(0, DESCRIPTION_MAX_LENGTH)}...`
                : study.description;

        contextParts.push(
            `\n${index + 1}. ${study.title}`,
            `   Study ID: ${study.studyId}`,
            `   Organism: ${study.organism ?? "N/A"}`,
            `   Project Type: ${study.projectType ?? "N/A"}`,
            `   Description: ${truncatedDesc}`
        );

        sources.push({
            title: `OSDR ${study.studyId}: ${study.title}`,
            url: study.url,
        });
    });

    return {
        contextText: contextParts.join("\n"),
        sources,
    };
}
