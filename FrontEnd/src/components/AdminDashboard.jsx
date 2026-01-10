const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('states');
  const [states, setStates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStateName, setNewStateName] = useState('');

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    const data = await mockApi.getStates();
    setStates(data);
  };

  const handleAddState = () => {
    if (newStateName.trim()) {
      setStates([...states, { state_id: states.length + 1, state_name: newStateName }]);
      setNewStateName('');
      setShowAddModal(false);
    }
  };

  const handleDeleteState = (id) => {
    setStates(states.filter(s => s.state_id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {['states', 'places', 'seasons', 'destinations'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 capitalize">Manage {activeTab}</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {states.map(state => (
                  <tr key={state.state_id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{state.state_id}</td>
                    <td className="py-3 px-4">{state.state_name}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteState(state.state_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New State</h3>
            <input
              type="text"
              value={newStateName}
              onChange={(e) => setNewStateName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter state name"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddState}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
cd