import { searchOSDR, formatOSDRDataForLLM } from "./src/services/nasaService";

async function test() {
    console.log("🧪 Testing OSDR API\n");

    const results = await searchOSDR("microgravity bone", 5);

    console.log(`📊 Found ${results.total} total results`);
    console.log(`Retrieved ${results.studies.length} studies\n`);

    results.studies.forEach((study, i) => {
        console.log(`${i + 1}. ${study.title}`);
        console.log(`   ID: ${study.studyId}`);
        console.log(`   Organism: ${study.organism || "N/A"}`);
        console.log(`   URL: ${study.url}\n`);
    });

    // Test formatting for LLM
    const formatted = formatOSDRDataForLLM(results);
    console.log("📝 Formatted for LLM:");
    console.log(formatted.contextText.substring(0, 400) + "...\n");
    console.log(`📚 ${formatted.sources.length} sources available`);
}

test().catch(console.error);
