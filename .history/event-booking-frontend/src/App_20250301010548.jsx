import EventsList from "./components/EventsList";
import AddEvent from "./components/AddEvent";

function App() {
  return (
    <div>
      <h1>Event Booking System</h1>
      <AddEvent />
      <EventsList />
    </div>
  );
}

export default App;
