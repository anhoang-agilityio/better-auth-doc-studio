import { z } from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    PROJECT_ID: z.string(),
    DATASET: z.string(),
  });

  const envVars = {
    PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    DATASET: process.env.SANITY_STUDIO_DATASET,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    const flattenedErrors = z.flattenError(parsedEnv.error);
    const errorMessages = Object.entries(flattenedErrors.fieldErrors)
      .map(([name, errors]) => {
        if (errors && errors.length > 0) {
          return `- ${name}: ${errors.join(', ')}`;
        }
        return null;
      })
      .filter(Boolean);

    throw new Error(
      `Invalid env provided. 
The following variables are missing or invalid: 
${errorMessages.join('\n')}`,
    );
  }

  return parsedEnv.data ?? {};
};

export const env = createEnv();
