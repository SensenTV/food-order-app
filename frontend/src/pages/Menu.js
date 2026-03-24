import { useParams } from 'react-router-dom';

export default function Menu() {
  const { id } = useParams();

  return (
    <div className="page">
      <h1>Menu for Restaurant {id}</h1>
      <p>Menu page - Coming soon</p>
    </div>
  );
}
