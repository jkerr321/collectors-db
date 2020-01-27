module.exports = {
    "options": {
        "colour_one": 'blue',
        "colour_two": 'white',
        "heading": 'Example Collectors Database',
        "sub_heading": 'Everton FC Programme Collection',
        "img_one_src": 'prog1a.png',
        "img_two_src": 'prog2.png',
    },
    "sheet_id": process.env.sheet_id,
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
}