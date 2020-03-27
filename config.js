module.exports = {
    options: {
        colour_one: '#ff0000',
        colour_two: '#ffd4d4',
        colour_three: '#FFE3E2',
        table_colour: 'ghostwhite',
        heading: `Paul's Arsenal Collection`,
        sub_heading: `Programmes, tickets and memorabilia`,
        img_one_src: 'everton_prog_1.jpg',
        img_two_src: 'everton_prog_2.jpg',
        img_three_src: 'PM_home_prog2.jpg',
        intro: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vitae dignissim lacus. Aenean nec fermentum augue, at dapibusodio.Vivamus lacus lorem, dictum non efficitur a, mattis vitae turpis.Integer elementum ipsum a enim dictum facilisis. Nullam suscipit convallis purus sit amet scelerisque.Suspendisse nec erat justo.Curabitur at suscipit dui.Sed aliqua pulvinar arcu.Aliquam erat volutpat. Nullam molestie tincidunt libero a viverra.Phasellus consequat, justo ut blandit varius, erat ante ornare libero, eleifend tristique tellus sapien sit amet felis.Integer laoreet, velit sed dignissim finibus, metus tellus elementum nisi, vitae pharetra diam orci nec metus.Sed suscipit dui id faucibus tempus.Vestibulum quis quam rutrum, semper tellus non, finibus lectus.`,
        data_points: {
            season: 'Season',
            date: 'Date',
            competition: 'Competition',
            opponent: 'Opponent',
            home_away: 'Home/Away',
            programme_got_want: 'Programme Got/Want',
            id: 'ID',
            friendly: 'Friendly',
            score: 'Score',
            cup_round: 'Cup Round',
            match_notes: 'Match Notes',
            ticket_got_want: 'Ticket Got/Want',
            price: 'Programme Price',
            notes: 'Programme Notes',
            other_items: 'Other Items',
            is_ticket_collection: true,
            includes_non_first_team: true
        },
    },
    password: 'password',
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
// muted
// --primary - color: #de0000;
// --secondary - color: #ffd4d4;
// --tertiary - color: #ffe730;

// bright with pink
// --primary - color: #ff0000;
// --secondary - color: #ffd4d4;
// --tertiary - color: #FFE3E2;

//yellow = #ffea00