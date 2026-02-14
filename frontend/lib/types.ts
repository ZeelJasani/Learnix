// ============================================================================
// Learnix LMS - Common Types (સામાન્ય ટાઇપ્સ)
// ============================================================================
// Aa file project-wide shared types define kare chhe.
// This file defines project-wide shared types.
// ============================================================================

// API response no standard type / Standard type for API response
export type ApiResponse = {
    status: "success" | "error";
    message: string;
};