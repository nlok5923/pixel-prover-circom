import { Elysia, Context } from "elysia";
import { cors } from '@elysiajs/cors';
import path from 'path';
import * as snarkjs from 'snarkjs';

const app = new Elysia();

const generateProof = async (ctx: Context) => {
  // console.log('This is context ', ctx);
  //@ts-ignore
  const img_data = JSON.parse(ctx.body.input);
  // console.log('This is context ', ctx.body);
  // console.log('This is context ', img_data);
  //@ts-ignore
  const image_array = img_data.input;

  const rows = 128;
  const cols = 128;
  const image: String[][] = new Array(rows);
  
  for (let i = 0; i < rows; i++) {
    image[i] = new Array(cols).fill(0); 
  }

  let img_index = 0;
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 128; j++) {
      image[i][j] = String(image_array[img_index]);
      img_index++;
    }
  }

  // console.log(image);

  // let image_ag: String[] = new Array(rows);;

  // for(let i = 0; i < 128; i++) {
  //     image_ag.push(JSON.stringify(image[i]));
  // }

  const wasmPath = path.join(__dirname, 'circuit_a.wasm');
  const zkeyPath = path.join(__dirname, 'circuit_final_a.zkey');

  let input =  {
    orig: image,
    option: 1,
  }

console.log('req cam ');
  //@ts-ignore
  try {
    console.log(input);
    //@ts-ignore
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);

  console.log('proof', proof);
  console.log("signals", publicSignals);
  } catch (err) {
    console.log(err);
  }


  return JSON.stringify({ message: "Added" }), {
    headers: { "Content-Type": "application/json" },
  };

}

app.use(cors());
app.get("/", () => "Hello! this is Pixel Police Proof Generator!");
app.post("/generate-proof", (ctx) => generateProof(ctx));

app.listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
