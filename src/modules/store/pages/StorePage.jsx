import { useOutletContext } from 'react-router-dom';
import ProductsGrid from '../components/ProductsGrid';

const StorePage = () => {
    const { search } = useOutletContext();   

  return <ProductsGrid search={search} />;
};

export default StorePage;