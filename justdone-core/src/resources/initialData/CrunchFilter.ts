export default function getCrunchFilter() {
    return [{
        'isglobal': true,
        'type': 1,
        'coa': 1,
        'conditions': [{
            'operator': 'includes',
            'description': 'book'
        },
        {
            'operator': 'startsWith',
            'description': 'C'
        },
        {
            'operator': 'equal',
            'description': 'pen'
        }],
    },
    {
        'isglobal': false,
        'type': 1,
        'coa': 1,
        'conditions': [{
            'operator': 'includes',
            'description': 'book'
        },
        {
            'operator': 'startsWith',
            'description': 'C'
        },
        {
            'operator': 'equal',
            'description': 'pen'
        }],
    },
    {
        'isglobal': false,
        'type': 2,
        'coa': 2,
        'conditions': [{
            'operator': 'includes',
            'description': 'book'
        },
        {
            'operator': 'startsWith',
            'description': 'C'
        },
        {
            'operator': 'equal',
            'description': 'pen'
        }],
    },
    {
        'isglobal': true,
        'type': 2,
        'coa': 2,
        'conditions': [{
            'operator': 'includes',
            'description': 'book'
        },
        {
            'operator': 'startsWith',
            'description': 'C'
        },
        {
            'operator': 'equal',
            'description': 'pen'
        }],
    }];
}

