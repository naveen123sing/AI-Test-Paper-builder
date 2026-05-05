import axiosClient from "@/app/services/AxiosClient";
import { useMutation } from "@tanstack/react-query"

export interface QuizResponse {
    quiz_id?: number;
    semester?: string;
    branch?: string;
    subject_code?: string;
    subject_name?: string;
    filename?: string;
    word_count?: number;
    num_questions?: number;
    question_type?: string;
    questions: {
        id: number;
        type?: string;
        difficulty?: string;
        unit?: string;
        topic?: string;
        question: string;
        options?: string[] | {
            A: string;
            B: string;
            C: string;
            D: string;
        };
        answer?: string;
        correctAnswer?: number;
        explanation?: string;
    }[];
}

export interface CreateAccountPayload {
    name: string;
    email: string;
    plan: string;
}

export type DifficultyPayload = {
    easy: number;
    medium: number;
    hard: number;
};

export type GenerateQuizPayload = {
    file: File;
    questionCount: number;
    difficulty: DifficultyPayload;
    questionTypes: string[];
};

// const getBasicToken = () => {
//     const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
//     const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

//     const encoded = btoa(`${clientId}:${clientSecret}`);

//     return `Basic ${encoded}`;
// };

const getAccessToken = async () => {
    // const basicToken = getBasicToken();
    const apiKey = localStorage.getItem("api_key");

    if (!apiKey) {
        throw new Error("API key not found. Please create your account first.");
    }

    const response = await axiosClient.get("/auth/guest", {
        headers: {
            // Authorization: basicToken,
            "x-api-key": apiKey,
            "Content-Type": "application/json",
        },
    });

    const token = response.data.access_token;

    localStorage.setItem("token", token);

    return token;
};

export const generateQuiz = async (payload: GenerateQuizPayload) => {
    let token = localStorage.getItem("token");

    if (!token) {
        token = await getAccessToken();
    }

    const formData = new FormData();

    formData.append("file", payload.file);
    formData.append("fileName", payload.file.name);
    formData.append("fileType", payload.file.type);
    formData.append("questionCount", String(payload.questionCount));
    formData.append("difficulty", JSON.stringify(payload.difficulty));
    formData.append("easy", String(payload.difficulty.easy));
    formData.append("medium", String(payload.difficulty.medium));
    formData.append("hard", String(payload.difficulty.hard));
    formData.append("questionTypes", JSON.stringify(payload.questionTypes));

    const response = await axiosClient.post(
        "/generate-from-syllabus",
        formData
    );

    // if (!localStorage.getItem("token") && response.data.token) {
    //     localStorage.setItem("token", response.data.token);
    // }

    return response.data;
};

export const useGenerateQuiz = () => {
    return useMutation({
        mutationFn: (payload: GenerateQuizPayload) => generateQuiz(payload),
    });
};

export const createAccount = async (payload: CreateAccountPayload) => {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("plan", payload.plan);

    const response = await axiosClient.post("/admin/create-customer", formData);

    return response.data;
};

export const useCreateAccount = () => {
    return useMutation({
        mutationFn: (payload: CreateAccountPayload) => createAccount(payload),
    });
};
