import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { ApiError } from './apiError';

/**
 * Resolves a Course ID or Slug to a MongoDB ObjectId string.
 * Use this in Services to handle flexible inputs.
 */
export async function resolveCourseId(idOrSlug: string): Promise<string> {
    if (!idOrSlug) {
        throw ApiError.badRequest('Course ID or Slug is required');
    }

    // if it's a valid ObjectId, assume it's an ID
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        return idOrSlug;
    }

    // Otherwise, try to find by slug
    // Dynamic import to avoid circular dependencies if models import services
    // but here we are in utils, importing Model is fine.
    const course = await Course.findOne({ slug: idOrSlug }).select('_id').lean();

    if (!course) {
        throw ApiError.notFound('Course not found');
    }

    return course._id.toString();
}

/**
 * Validates if value is a valid MongoDB ObjectId
 */
export function validateObjectId(id: string, resourceName: string = 'Resource'): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.badRequest(`Invalid ${resourceName} ID`);
    }
}
