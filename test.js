[
    {
        '$group': {
            '_id': '$owner',
            'averageDuration': {
                '$avg': '$duration'
            }
        }
    }
]