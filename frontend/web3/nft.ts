
type PropertyFields = {
    type: string;
    description: string;
}

type ERC721MetadataProperties = {
    name: PropertyFields,
    description: PropertyFields,
    image: PropertyFields
}

interface ERC721MetadataSchema {
    title: string,
    type: string,
    properties: ERC721MetadataProperties
}

export function parseERC721MetadataJsonSchema(data) {
    return JSON.parse(data) as ERC721MetadataProperties;
}

export async function fetchMetadata(URI: string) {
    return await fetch(URI);
}