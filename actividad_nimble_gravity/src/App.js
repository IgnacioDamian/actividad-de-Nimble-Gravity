import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";
const EMAIL = "gonzalezignaciodam@gmail.com";

function App() {

  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");

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

  const handleApply = async (jobId) => {
    if (!repoUrl) {
      alert("Por favor, ingresa la URL de tu repositorio de GitHub.");
      return;
    }

    const payload = {
      uuid: candidate.uuid,
      jobId: jobId,
      candidateId: candidate.candidateId,
      repoUrl: repoUrl
    };
      try {
      const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.ok) {
        alert("¡Postulación enviada con éxito!");
      }
    } catch (error) {
      alert("Hubo un error al enviar la postulación.");
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando datos de la práctica...</div>;

  return (
    <div className='divisor1'>
      <header className='header1'>
        <h1>Challenge de Postulación para Nimble Gravity</h1>
        {candidate && (
          <p>Bienvenido: <strong>{candidate.firstName} {candidate.lastName}</strong> ({candidate.email})</p>
        )}
      </header>
      <section>
        <h2>Posiciones Abiertas</h2>
        <div className='divisor2'>
          {jobs.map((job) => (
            <div key={job.id} className='divColumna'>
              <h3 className='h3'>{job.title}</h3>
              
              <div className='divInterno'>
                <input 
                  type="text" 
                  placeholder="URL del repo GitHub"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className='input'
                />
                <button 
                  onClick={() => handleApply(job.id)}
                  className='boton'
                >
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
