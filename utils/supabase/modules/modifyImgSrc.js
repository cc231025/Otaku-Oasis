
// Just a base function that returns a valid supabase image url, used throughout multiple components, I cannot put it into my server components, that's why i created an additional file
export function modifySrc(src) {
    return `https://mpzladtvsavdvsdesjkx.supabase.co/storage/v1/object/public/profile_images/${src}`;
}