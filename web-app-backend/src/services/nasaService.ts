/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

const OSDR_BASE_URL = "https://osdr.nasa.gov/osdr/data/osd";
const API_TIMEOUT = 10000; // 10 seconds

/**
 * Search OSDR for space biology studies
 *
 * @param query - Search term (e.g., "bone", "radiation", "microgravity")
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Promise with search results
 */
export async function searchOSDR(
    query: string,
    limit = 10
): Promise<OSDRSearchResult> {
    try {
        console.log(`🔍 Searching OSDR for: "${query}"`);

        const response = await axios.get(`${OSDR_BASE_URL}/studies`, {
            params: {
                term: query,
                size: limit,
                from: 0,
            },
            timeout: API_TIMEOUT,
        });

        const hits = (response.data?.hits?.hits as unknown) ?? [];

        const studies: OSDRStudy[] = hits.map((hit: unknown) => {
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

        console.log(`✅ OSDR: Found ${studies.length} studies`);

        return {
            total: response.data?.hits?.total?.value ?? 0,
            studies,
        };
    } catch (error) {
        console.error("❌ OSDR API Error:", error);

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
 * Get detailed information about a specific OSDR study
 *
 * @param studyId - OSDR study accession number (e.g., "OSD-123")
 * @returns Promise with detailed study information
 */
export async function getOSDRStudyDetails(studyId: string): Promise<any> {
    try {
        console.log(`📖 Fetching OSDR study details: ${studyId}`);

        const response = await axios.get(
            `${OSDR_BASE_URL}/studies/${studyId}`,
            { timeout: API_TIMEOUT }
        );

        console.log(`✅ OSDR: Retrieved details for ${studyId}`);
        return response.data;
    } catch (error) {
        console.error(`❌ OSDR API Error fetching ${studyId}:`, error);
        throw new Error(`Failed to fetch study ${studyId} from OSDR`);
    }
}

/**
 * Search OSDR by specific organism
 *
 * @param organism - Organism name (e.g., "Homo sapiens", "Mus musculus")
 * @param limit - Maximum number of results
 * @returns Promise with search results
 */
export async function searchOSDRByOrganism(
    organism: string,
    limit = 10
): Promise<OSDRSearchResult> {
    try {
        console.log(`🔍 Searching OSDR for organism: "${organism}"`);

        const response = await axios.get(`${OSDR_BASE_URL}/studies`, {
            params: {
                "organism_name.raw": organism,
                size: limit,
            },
            timeout: API_TIMEOUT,
        });

        const hits = (response.data?.hits?.hits as OSDRSearchResult[]) ?? [];

        const studies: OSDRStudy[] = hits.map((hit: unknown) => {
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

        console.log(`✅ OSDR: Found ${studies.length} studies for ${organism}`);

        return {
            total: (response.data?.hits?.total?.value as number) ?? 0,
            studies,
        };
    } catch (error) {
        console.error("❌ OSDR API Error:", error);
        return { total: 0, studies: [] };
    }
}

/**
 * Format OSDR results for LLM context
 *
 * @param results - OSDR search results
 * @returns Formatted text for LLM and list of sources
 */
export function formatOSDRDataForLLM(results: OSDRSearchResult): {
    contextText: string;
    sources: { title: string; url: string }[];
} {
    const contextParts: string[] = [];
    const sources: { title: string; url: string }[] = [];

    if (results.studies.length === 0) {
        return {
            contextText: "No relevant studies found in OSDR.",
            sources: [],
        };
    }

    contextParts.push("=== OSDR Space Biology Studies ===");

    results.studies.forEach((study, index) => {
        contextParts.push(
            `\n${index + 1}. ${study.title}`,
            `   Study ID: ${study.studyId}`,
            `   Organism: ${study.organism ?? "N/A"}`,
            `   Project Type: ${study.projectType ?? "N/A"}`,
            `   Description: ${study.description.substring(0, 250)}...`
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
