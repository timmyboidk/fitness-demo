export interface ScoreRequest {
    moveId: string;
    sessionId?: string;
    timestamp: number;
    data: {
        keypoints?: any[]; // Replace 'any' with specific Pose type if available
        frame?: string; // Base64 string if needed
    };
}

export interface FeedbackItem {
    type: 'correction' | 'praise';
    message: string;
    severity?: 'low' | 'medium' | 'high';
}

export interface ScoreResponse {
    success: boolean;
    score: number;
    feedback: FeedbackItem[];
    metrics?: Record<string, string>;
}

class AIScoringService {
    private baseUrl = 'https://api.fitbody.com/api/ai'; // Mock URL

    async scoreMove(request: ScoreRequest): Promise<ScoreResponse> {


        // Mock API Call Delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock Response Logic
        // In a real app, this would be a fetch() call
        const mockScore = Math.floor(Math.random() * (100 - 70) + 70); // Random score 70-100

        return {
            success: true,
            score: mockScore,
            feedback: [
                {
                    type: 'correction',
                    message: 'Keep your core tight',
                    severity: 'medium'
                },
                {
                    type: 'praise',
                    message: 'Great tempo!'
                }
            ]
        };
    }
}

export const aiScoringService = new AIScoringService();
