import { bubbleSortLesson } from './bubble/teach';
import { quickSortLesson } from './quick/teach';
import { mergeSortLesson } from './merge/teach';
// Import other algorithm lessons...

export const algorithmLessons: Record<string, any> = {
    'bubble-sort': bubbleSortLesson,
    'quick-sort': quickSortLesson,
    'merge-sort': mergeSortLesson,
    // Add other algorithms...
}; 