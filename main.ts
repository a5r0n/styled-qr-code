import { Serve } from './src/cli/serve.ts';
import { main } from './src/cli/cli.ts';

// Execute main() if running as a script
// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  if (Deno.args.length === 0) {
    console.log('Choose a subcommand: serve, generate');
  } else if (Deno.args[0] === 'serve') {
    await Serve();
  } else if (Deno.args[0] === 'generate') {
    await main(Deno.args.slice(1));
  }
}
