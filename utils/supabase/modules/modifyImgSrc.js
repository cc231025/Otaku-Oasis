
// Just a base function used throughout multiple components, I cannot put it into my server components, that's why i created an additional file
export function modifySrc(src) {
    return `https://cubqswjwvoydndaledhg.supabase.co/storage/v1/object/public/profile_images/${src}`;
}