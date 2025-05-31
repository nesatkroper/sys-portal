import { exec } from 'child_process';
import { promisify } from 'util';
import type { NextApiRequest, NextApiResponse } from 'next';

const execAsync = promisify(exec);

type SuccessResponse = {
  stats: string;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    const { stdout } = await execAsync(
      `ssh youruser@yourvps.com "top -bn1 | head -5 && df -h && free -m"`
    );
    res.status(200).json({ stats: stdout });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}



// import { exec } from 'child_process';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { promisify } from 'util';

// const execAsync = promisify(exec);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     // For security, use environment variables for credentials
//     const { stdout } = await execAsync(
//       `ssh youruser@yourvps.com "top -bn1 | head -5 && df -h && free -m"`
//     );
//     res.status(200).json({ stats: stdout });
//   } catch (error) {
//     // Proper error type checking
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: 'An unknown error occurred' });
//     }
//   }
// }