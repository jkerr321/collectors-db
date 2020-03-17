module.exports = {
    options: {
        colour_one: 'darkblue',
        colour_two: 'yellow',
        heading: 'Example Collectors Database',
        sub_heading: 'Everton FC Programme Collection',
        img_one_src: 'everton_prog_1.jpg',
        img_two_src: 'everton_prog_2.jpg',
        // data points to be used on site, and their row heading names on the spreadsheet
        //TODO have base datapoints already on the model, then append with optional data points
        data_points: {
            season: 'Season',
            date: 'Date',
            competition: 'Competition',
            opponent: 'Opponent',
            home_away: 'Home/Away',
            programme_got_want: 'Programme Got/Want',
            id: 'ID',
            score: 'Score',
            position: 'Position',
            points: 'Points',
            cup_round: 'Cup Round',
            match_notes: 'Match Notes',
            ticket_got_want: 'Ticket Got/Want',
            price: 'Programme Price',
            notes: 'Programme Notes', //TODO change this to programme_notes
            ground: 'Ground',
            attendance: 'Att',
            other_items: 'Other Items',
            is_ticket_collection: true
        },
    },
    password: process.env.password,
    sheet_id: process.env.sheet_id,
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url
}
