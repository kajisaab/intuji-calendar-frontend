const filterKeys: filterKeysInterface[] = [
    { name: 'View All', color: '#7367F0' },
    { name: 'Personal', color: '#EA5455' },
    { name: 'Business', color: '#7367F0' },
    { name: 'Family', color: '#FF9F43' },
    { name: 'Holiday', color: '#28C76F' },
    { name: 'ETC', color: '#00CFE8' }
];

export interface filterKeysInterface {
    name: string;
    color: string;
}

export { filterKeys };
