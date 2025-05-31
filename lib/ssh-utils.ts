// lib/ssh-utils.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

type CommandResult = {
  success: boolean;
  output: string;
  error?: string;
};

export async function execSSH(command: string): Promise<CommandResult> {
  const sshUser = process.env.SSH_USER;
  const sshHost = process.env.SSH_HOST;
  
  if (!sshUser || !sshHost) {
    return {
      success: false,
      output: '',
      error: 'SSH credentials not configured'
    };
  }

  try {
    const { stdout } = await execAsync(
      `ssh ${sshUser}@${sshHost} "${command.replace(/"/g, '\\"')}"`
    );
    return { success: true, output: stdout };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown SSH error'
    };
  }
}