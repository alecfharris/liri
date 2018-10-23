console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    api_key: process.env.OMDB_API
};

exports.bandsInTown = {
    api_key: process.env.BandsInTow_API
}