import App from './app/app';
import { getAllProduct } from './components/servercomp/servercomp';

const app = new App();

app.view();

getAllProduct();
