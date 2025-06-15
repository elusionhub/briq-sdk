import "dotenv/config";
import { Briq } from '../src';

const briq = new Briq({
    apiKey: process.env.BRIQ_API_KEY || '',
});

async function checkConnection() {
    try {
        const isConnected = await briq.testConnection();
        console.log('Connection successful:', isConnected);
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

async function createWorkSpace(name: string, description: string) {
    try {
        const workspace = await briq.workspaces.create({
            name,
            description
        });
        console.log('Workspace created:', workspace.data);
    } catch (error) {
        console.error('Failed to create workspace:', error);
    }

}

async function updateWorkSpace(workspaceId: string, name: string, description: string) {
    try {
        const updatedWorkspace = await briq.workspaces.update(workspaceId, {
            name,
            description
        });
        console.log('Workspace updated:', updatedWorkspace.data);
    } catch (error) {
        console.error('Failed to update workspace:', error);
    }
}

async function getWorkSpace(workspaceId: string) {
    try {
        const workspace = await briq.workspaces.getById(workspaceId);
        console.log('Workspace details:', workspace.data);
    } catch (error) {
        console.error('Failed to get workspace:', error);
    }
}

async function listWorkSpaces() {
    try {
        const workspaces = await briq.workspaces.list();
        console.log('Workspaces:', workspaces.data);
    } catch (error) {
        console.error('Failed to list workspaces:', error);
    }
}

async function main() {
    // await checkConnection();
    listWorkSpaces();
    // await createWorkSpace('Test Workspace', 'This is a test workspace created using the Briq SDK');
    // await getWorkSpace("466e6a77-6f38-4b51-afbb-4b63ebf4ff43");
    // await updateWorkSpace("466e6a77-6f38-4b51-afbb-4b63ebf4ff43", 'Updated Workspace', 'This is an updated description');
}

main().catch(error => {
    console.error('An error occurred:', error);
});