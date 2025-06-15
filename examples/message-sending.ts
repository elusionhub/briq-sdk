import { briq } from '../src';


async function sendMessage() {
    const client = briq();

    try {
        const response = await client.messages.sendInstant({
            recipients: ['255700000000'],
            content: 'Hello from Briq!',
            sender_id: 'your-sender-id',
        });
        if (Array.isArray(response.data)) {
            console.log('Message sent successfully:', response.data.map(msg => msg.status));
        } else {
            console.log('Message sent successfully:', response.data?.status);
        }
    } catch (error) {
        console.error('Failed to send message:', error);
    }
}

async function sendCampaignMessage() {
    const client = briq();
    try {
        const response = await client.messages.sendCampaign({
            campaign_id: 'your-campaign-id',
            group_id: 'your-group-id',
            content: 'Hello from Briq Campaign!',
            sender_id: 'BRIQ',
        });
        console.log('Campaign message sent successfully:', response.data);
    } catch (error) {
        console.error('Failed to send campaign message:', error);
    }
}

async function getMessageLogs() {
    const client = briq();
    try {
        const response = await client.messages.getLogs();
        console.log('Message logs:', response.data);
    } catch (error) {
        console.error('Failed to fetch message logs:', error);
    }
}

async function getMessageHistory() {
    const client = briq();
    try {
        const response = await client.messages.getHistory();
        console.log('Message history:', response.data);
    } catch (error) {
        console.error('Failed to fetch message history:', error);
    }
}

async function main() {
    // await sendMessage();
    // await sendCampaignMessage();
    await getMessageLogs();
}

main().catch(error => {
    console.error('Error in message sending example:', error);
});