import { useState } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Users as UsersIcon } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PLACEHOLDER_EVENTS = [
  { _id: '1', title: 'Sunday Worship Service', location: 'Main Sanctuary', startDate: '2025-07-13', maxCapacity: 500, attendees: 245, status: 'Active' },
  { _id: '2', title: 'Youth Encounter Night', location: 'Youth Centre', startDate: '2025-07-19', maxCapacity: 80, attendees: 42, status: 'Upcoming' },
  { _id: '3', title: 'Prayer Summit', location: 'Main Sanctuary', startDate: '2025-07-25', maxCapacity: 200, attendees: 12, status: 'Upcoming' },
  { _id: '4', title: 'Women of Purpose Conference', location: 'Main Sanctuary', startDate: '2025-08-09', maxCapacity: 150, attendees: 0, status: 'Draft' },
];

type EventItem = typeof PLACEHOLDER_EVENTS[0];

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-blue-100 text-blue-700',
  Draft: 'bg-slate-100 text-slate-600',
};

const ManageEvents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PLACEHOLDER_EVENTS.filter(
    (e) => e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Event',
      render: (item: EventItem) => (
        <div>
          <p className="font-semibold text-slate-800">{item.title}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" /> {item.location}
          </p>
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Date',
      render: (item: EventItem) => <span className="text-slate-500">{new Date(item.startDate).toLocaleDateString()}</span>,
    },
    {
      key: 'capacity',
      header: 'Registrations',
      render: (item: EventItem) => (
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-medium">{item.attendees}</span>
          <span className="text-slate-400 text-xs">/ {item.maxCapacity}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: EventItem) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Events</h2>
          <p className="text-sm text-slate-500">{PLACEHOLDER_EVENTS.length} total events</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          Create Event
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No events found." />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Event" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input id="event-title" label="Event Title" placeholder="e.g. Sunday Worship Service" required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="event-date" label="Start Date" type="date" required />
            <Input id="event-end" label="End Date (Optional)" type="date" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="event-location" label="Location" placeholder="e.g. Main Sanctuary" required />
            <Input id="event-capacity" label="Max Capacity" type="number" placeholder="e.g. 200" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the event..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="secondary">Create Event</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents;
