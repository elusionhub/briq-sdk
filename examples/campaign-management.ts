import { briq } from "../src";

async function createCampaign(
    workspace_id: string = "your-workspace-id",
    name: string = "New Campaign",
    description: string = "This is a new campaign",
    launch_date: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
) {
    try {
        const campaign = await briq().campaigns.create({
            name,
            description,
            workspace_id,
            launch_date: launch_date.toISOString(),
        });
        console.log("Campaign created:", campaign.data);
    } catch (error) {
        console.error("Error creating campaign:", error);
    }
}

async function updateCampaign(id: string, workspace_id: string, name: string, description: string) {
    try {
        const updatedCampaign = await briq().campaigns.update(id, {
            workspace_id,
            name,
            description,
            launch_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        });
        console.log("Campaign updated:", updatedCampaign);
    } catch (error) {
        console.error("Error updating campaign:", error);
    }
}

async function getCampaign(id: string) {
    try {
        const campaign = await briq().campaigns.getById(id);
        console.log("Campaign details:", campaign);
    } catch (error) {
        console.error("Error fetching campaign:", error);
    }
}

async function listCampaigns() {
    try {
        const campaigns = await briq().campaigns.list();
        console.log("Campaigns in workspace:", campaigns);
    } catch (error) {
        console.error("Error listing campaigns:", error);
    }
}

async function main() {
    const workspace_id = "0854d4ef-46df-49c6-8811-7d110d1814d1";

    // Create a new campaign
    // await createCampaign(workspace_id, "Test Campaign", "This is a test campaign");

    // List all campaigns
    // await listCampaigns();

    const firstCampaignId = "4ab33b66-2207-4f82-817d-2f9779888ee7";
    // await updateCampaign(firstCampaignId, workspace_id, "Updated Campaign", "Updated description");

    // Get details of the updated campaign
    // await getCampaign(firstCampaignId);
}

main().catch(console.error);