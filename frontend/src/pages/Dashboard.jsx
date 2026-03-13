import ContainerCard from "../components/ContainerCard";

const Dashboard = ({ count, liveData }) => {
  return (
    <div className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <ContainerCard 
            key={i} 
            id={i + 1} 
            // Logical check: only slot 1 gets the sensor data
            data={i === 0 ? liveData : null} 
          />
        ))}
      </div>
    </div>
  );
};
export default Dashboard;