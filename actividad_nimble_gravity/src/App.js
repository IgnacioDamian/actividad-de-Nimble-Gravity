import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const EMAIL = "gonzalezignaciodam@gmail.com";

function JobItem({ job, candidate, onApply }) {
  const [localRepoUrl, setLocalRepoUrl] = useState("");

  return (
    <div className='divColumna'>
      <h3 className='h3'>{job.title}</h3>
      <div className='divInterno'>
        <input 
          type="text" 
          placeholder="URL del repo GitHub"
          value={localRepoUrl}
          onChange={(e) => setLocalRepoUrl(e.target.value)}
          className='input'
        />
        <button 
          onClick={() => onApply(job.id, localRepoUrl)} 
          className='boton'
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidateRes = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${EMAIL}`);
        const candidateData = await candidateRes.json();
        setCandidate(candidateData);

        const jobsRes = await fetch(`${BASE_URL}/api/jobs/get-list`);
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleApply = async (jobId, urlParaEnviar) => {
    if (!urlParaEnviar) {
      alert("Por favor, ingresa la URL de tu repositorio de GitHub.");
      return;
    }

    const payload = {
      uuid: candidate.uuid,
      jobId: jobId,
      candidateId: candidate.candidateId,
      repoUrl: urlParaEnviar
    };

    try {
      const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.ok) {
        alert(`¡Postulación para el puesto ${jobId} enviada con éxito!`);
      }
    } catch (error) {
      alert("Hubo un error al enviar la postulación.");
    }
  };

  if (loading) return <div style={{ padding: '20px', color: 'white' }}>Cargando datos de la práctica...</div>;

  return (
    <div className='fondo'>
      <div className='divisor1'>
        <header className='h1'>
          <h1>Challenge de Postulación para Nimble Gravity</h1>
          {candidate && (
            <p>Bienvenido: <strong>{candidate.firstName} {candidate.lastName}</strong> ({candidate.email})</p>
          )}
        </header>
        
        <section>
          <h2 className='h2'>Posiciones Abiertas</h2>
          <div className='divisor2'>
            {jobs.map((job) => (
              <JobItem 
                key={job.id} 
                job={job} 
                candidate={candidate} 
                onApply={handleApply} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;