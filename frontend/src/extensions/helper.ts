export function propertyOf<TObj>(name: keyof TObj): string {
    return name as string;
}