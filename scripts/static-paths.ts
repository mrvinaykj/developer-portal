import fs from 'fs';
import path from 'path';

const solutionsDirectory = path.join(process.cwd(), 'data/markdown/pages/solution/');

type SolutionPaths = {
  params: {
    solution: string;
  };
};

type ProductPaths = {
  params: {
    product: string;
    solution: string;
  };
};

export const getSolutionPaths = async (): Promise<SolutionPaths[]> => {
  const files = fs.readdirSync(solutionsDirectory);
  return files.map((file) => ({ params: { solution: file } }));
};

export const getProductPaths = async (): Promise<ProductPaths[]> => {
  const paths: ProductPaths[] = [];
  const solutions = fs.readdirSync(solutionsDirectory);
  solutions.forEach((solution) => {
    const subdir = path.join(solutionsDirectory, `${solution}/product`);
    const products = fs.readdirSync(subdir);
    products.forEach((product) => {
      if (product !== 'index.md') {
        paths.push({ params: { product, solution } });
      }
    });
  });
  return paths;
};
