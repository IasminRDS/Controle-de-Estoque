import { useState, useEffect } from 'react';

// Atrasa a atualização de um valor — usado na busca para só consultar a API
// depois que o usuário para de digitar.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
