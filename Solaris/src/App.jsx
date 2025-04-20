import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Fetch profile.json
    fetch('/data/profile.json')
      .then(res => res.json())
      .then(data => console.log('Profile:', data))
      .catch(err => console.error('Error fetching profile:', err));

    // Fetch courses.json
    fetch('/data/courses.json')
      .then(res => res.json())
      .then(data => console.log('Courses:', data))
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  return (
    <div>
      <h1>Solaris LMS</h1>
      <p>Check the console for mock data.</p>
    </div>
  );
}

export default App;