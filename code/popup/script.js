// popup/script.js

import { FaEnvelope, FaYoutube } from 'react-icons/fa';
import { TrendingUp } from 'lucide-react';

const { useState, useEffect } = React;
const { render } = ReactDOM;
const { TrendingUp } = lucideReact; // Assuming lucide-react is included
const { FaEnvelope, FaYoutube } = ReactIcons;
const { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } = Recharts;

function App() {
    const [data, setData] = useState({ website1: [], website2: [] });
    const [showModal, setShowModal] = useState(false);
    const [settings, setSettings] = useState({
        darkMode: false,
        notifications: true,
        autoRefresh: "15",
        exportFormat: "csv",
        // Add more default settings
    });

    useEffect(() => {
        // Fetch stored data on load
        browser.runtime.sendMessage({ action: "getData" }).then(response => {
            setData(response.data);
        });

        // Fetch stored settings
        browser.storage.local.get("settings").then(result => {
            if (result.settings) {
                setSettings(result.settings);
            }
        });
    }, []);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        browser.storage.local.set({ settings: newSettings });
    };

    return (
        <div className={`popup-container ${settings.darkMode ? 'dark' : 'light'}`}>
            <button onClick={openModal}>
                Open Tracker
            </button>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>List Tracker</h2>
                        <div className="button-group">
                            <button>
                                <FaEnvelope /> Email List
                            </button>
                            <button>
                                <FaYoutube /> Video List
                            </button>
                            <button>
                                <TrendingUp /> Analytics
                            </button>
                            <button>
                                <SettingsIcon onClick={() => setShowSettings(true)} /> Settings
                            </button>
                        </div>
                        {/* Conditionally render Analytics or Settings */}
                        {showSettings ? (
                            <Settings settings={settings} updateSettings={updateSettings} />
                        ) : (
                            <Analytics data={data} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function Analytics({ data }) {
    // Prepare data for the area chart
    const chartData = data.website1.map((entry, index) => ({
        timestamp: new Date(entry.timestamp).toLocaleDateString(),
        website1: entry.data.length,
        website2: data.website2[index] ? data.website2[index].data.length : 0
    }));

    {
        chartData.map((entry, index) => {
            if (index === 0) return null; // Skip first entry as there's no previous data
            const previousWebsite1 = data.website1[index - 1].data;
            const currentWebsite1 = data.website1[index].data;
            const diffWebsite1 = calculateDifferences(currentWebsite1, previousWebsite1);

            return (
                <tr key={index}>
                    <td>{entry.timestamp}</td>
                    <td>
                        <FaEnvelope /> Website1
                    </td>
                    <td>{diffWebsite1.added.join(", ")}</td>
                    <td>{diffWebsite1.removed.join(", ")}</td>
                </tr>
            );
        })
    }

    return (
        <div className="analytics-dashboard">
            <h3>Analytics Dashboard</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorWebsite1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorWebsite2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="website1" stroke="#8884d8" fillOpacity={1} fill="url(#colorWebsite1)" />
                    <Area type="monotone" dataKey="website2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorWebsite2)" />
                </AreaChart>
            </ResponsiveContainer>

            <h3>Comparison Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Collection Date</th>
                        <th>Source</th>
                        <th>Added Items</th>
                        <th>Removed Items</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Populate table rows based on data */}
                    {chartData.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.timestamp}</td>
                            <td>
                                <FaEnvelope /> {/* Adjust based on source */}
                                Website1
                            </td>
                            <td>{/* Calculate added items */}</td>
                            <td>{/* Calculate removed items */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function calculateDifferences(currentData, previousData) {
    const added = currentData.filter(item => !previousData.includes(item));
    const removed = previousData.filter(item => !currentData.includes(item));
    return { added, removed };
}

function Settings({ settings, updateSettings }) {
    const handleToggle = (key) => {
        updateSettings({ ...settings, [key]: !settings[key] });
    };

    const handleExportFormatChange = (event) => {
        updateSettings({ ...settings, exportFormat: event.target.value });
    };

    return (
        <div className="settings-panel">
            <h3>Settings</h3>
            <label>
                <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleToggle('darkMode')}
                />
                Dark Mode
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                />
                Enable Notifications
            </label>
            <label>
                Auto-refresh Interval:
                <select value={settings.autoRefresh} onChange={(e) => updateSettings({ ...settings, autoRefresh: e.target.value })}>
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                </select>
            </label>
            <label>
                Export Format:
                <select value={settings.exportFormat} onChange={handleExportFormatChange}>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                </select>
            </label>
            {/* Add more settings as needed */}
        </div>
    );
}


render(<App />, document.getElementById('app'));
