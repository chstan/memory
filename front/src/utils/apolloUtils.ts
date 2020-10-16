export interface IEntity {
    id: number;
    __typename: string;
}

export function entityToId(entity: IEntity): string {
    return `${entity.__typename}:${entity.id}`;
}

export default {
    entityToId,
}