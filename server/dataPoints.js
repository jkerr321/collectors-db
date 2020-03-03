const requiredDataPoints = {
    season: row.Season,
    date: row.Date,
    competition: row.Competition,
    opponent: row.Opponent,
    home_away: row['Home/Away'],
    got_want: row['Got/Want'],
}

const id = row.ID

const optionalDataPoints = {
    score: row.Score,
    position: row.Position,
    points: row.Points,
    cup_round: row['Cup Round'],
    match_notes: row['Match Notes'],
    ticket_got_want: row['Ticket Got/Want'],
    price: row['Programme Price'],
    notes: row['Programme Notes'],
    ground: row.Ground,
    attendance: row.Att,
    other_items: row['Other Items']
}

module.exports = { requiredDataPoints, optionalDataPoints };