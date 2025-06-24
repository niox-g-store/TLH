  /*const [eventsData, setEventsData] = useState([]);
  const navigate = useNavigate();

  const currentUser = getCurrentUserDetail() ?? null;

  const userID = currentUser ? currentUser.id : null; // Assuming your user ID is stored as 'id' in the currentUser object

  useEffect(() => {
    // Function to fetch event data from backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/getEvents");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    // Call the fetchEvents function
    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const register = async (eventId, userID) => {
    try {
      // Check if user is authenticated
      /*if (!isLoggedIn()) {
        // Redirect to login page
        navigate("/login"); // Adjust the login page URL as needed
        return;
      }
      console.log(userID, "Inside User iD");
      const response = await fetch("http://localhost:3000/register-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ eventId, userID }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Optionally, you can refresh the events data after successful registration
      // fetchEvents();
      // Or update the eventsData state to reflect the registration
      // setEventsData(newEventsData);
      console.log("Registration successful");
      alert("Registration Successful");
    } catch (error) {
      console.error("Error registering for event:", error);
    }
  };

  const formatDateRange = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleString("default", { month: "short" });
    const year = startDate.getFullYear().toString().substr(-2); // Get last two digits of the year
    return `${startDay} - ${endDay} ${month} ${year}`;
  };

  // Function to check if the current date falls within the event date range



  });*/