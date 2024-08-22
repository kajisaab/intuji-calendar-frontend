const filterKeys: filterKeysInterface[] = [
    { name: 'View All', color: '#7367F0', checked: false },
    { name: 'Personal', color: '#EA5455', checked: false },
    { name: 'Business', color: '#7367F0', checked: false },
    { name: 'Family', color: '#FF9F43', checked: false },
    { name: 'Holiday', color: '#28C76F', checked: false },
    { name: 'ETC', color: '#00CFE8', checked: false }
];

export interface filterKeysInterface {
    name: string;
    color: string;
    checked: boolean;
}

export { filterKeys };
