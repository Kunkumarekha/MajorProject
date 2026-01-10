const UserSearch = () => {
  const [states, setStates] = useState([]);
  const [places, setPlaces] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [budget, setBudget] = useState(50000);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedState) {
      loadPlaces(selectedState);
    }
  }, [selectedState]);

  const loadInitialData = async () => {
    const statesData = await mockApi.getStates();
    const seasonsData = await mockApi.getSeasons();
    setStates(statesData);
    setSeasons(seasonsData);
  };

  const loadPlaces = async (stateId) => {
    const placesData = await mockApi.getPlaces(stateId);
    setPlaces(placesData);
    setSelectedPlace('');
  };

  const handleSearch = async () => {
    setLoading(true);
    const filters = {
      state: selectedState,
      place: selectedPlace,
      season: selectedSeason,
      budget: budget
    };
    const searchResults = await mockApi.searchDestinations(filters);
    setResults(searchResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Travel Discovery Platform
          </h1>
          <p className="text-gray-600 mt-1">Find your perfect destination</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Place
              </label>
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!selectedState}
              >
                <option value="">Select Place</option>
                {places.map(place => (
                  <option key={place.place_id} value={place.place_id}>
                    {place.place_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Season
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Season</option>
                {seasons.map(season => (
                  <option key={season.season_id} value={season.season_id}>
                    {season.season_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4" />
                Budget: ₹{budget.toLocaleString()}
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {loading ? 'Searching...' : 'Search Destinations'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map(destination => (
              <div
                key={destination.destination_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                  <h3 className="text-2xl font-bold">{destination.place_name}</h3>
                  <p className="text-blue-100">{destination.state_name} • {destination.season_name}</p>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Estimated Cost</span>
                    <span className="text-2xl font-bold text-blue-600">₹{destination.cost_estimate.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bus className="w-4 h-4" />
                      {destination.transportation.length} Transport Options
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hotel className="w-4 h-4" />
                      {destination.accommodations.length} Accommodations
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <PartyPopper className="w-4 h-4" />
                      {destination.festivals.length} Festivals
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      {destination.guides.length} Guides Available
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedDestination && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full my-8 max-h-screen overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white sticky top-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedDestination.place_name}</h2>
                    <p className="text-blue-100">{selectedDestination.state_name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDestination(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-blue-600" />
                    Transportation Options
                  </h3>
                  <div className="grid gap-3">
                    {selectedDestination.transportation.map(transport => (
                      <div key={transport.transport_id} className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">{transport.transport_type}</span>
                        <span className="text-blue-600 font-bold">₹{transport.cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-purple-600" />
                    Accommodations
                  </h3>
                  <div className="grid gap-3">
                    {selectedDestination.accommodations.map(acc => (
                      <div key={acc.accommodation_id} className="bg-purple-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">{acc.accommodation_type}</span>
                        <span className="text-purple-600 font-bold">₹{acc.cost.toLocaleString()}/night</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <PartyPopper className="w-5 h-5 text-pink-600" />
                    Festivals & Events
                  </h3>
                  <div className="grid gap-3">
                    {selectedDestination.festivals.map(festival => (
                      <div key={festival.festival_id} className="bg-pink-50 p-4 rounded-lg">
                        <div className="font-medium">{festival.festival_name}</div>
                        <div className="text-sm text-gray-600">{festival.dates}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Local Guides
                  </h3>
                  <div className="grid gap-3">
                    {selectedDestination.guides.map(guide => (
                      <div key={guide.guide_id} className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium">{guide.guide_name}</span>
                        <span className="flex items-center gap-2 text-green-600">
                          <Phone className="w-4 h-4" />
                          {guide.contact_info}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Reviews
                  </h3>
                  <div className="space-y-4">
                    {selectedDestination.reviews.map(review => (
                      <div key={review.review_id} className="border-l-4 border-yellow-400 bg-gray-50 p-4 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
