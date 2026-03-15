export const generateKey = (projectId: string,apiName: string) => {
    return `${projectId}-${apiName.toLowerCase().trim().replace(/ /g, '-')}`
}