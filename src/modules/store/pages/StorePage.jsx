import { useOutletContext } from 'react-router-dom';
import ProductsGrid from '../components/productsGrid.jsx';

const StorePage = () => {
    const { search } = useOutletContext();   

  return <ProductsGrid search={search} />;
};

export default StorePage;