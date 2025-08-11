

export type Project = {
  name: string;
  description: string;
  project_code: string;
  isOwnProject: boolean;
  is_public?: boolean;
} | null;

export interface ProjectListProps {
  limit?: number;
  onlyShowOwnProjects?: boolean;
  showSearchInput?: boolean;
}

export interface ProjectFormProps {
  project?: Project;
  isEdit?: boolean;
}

export type ErrorResponse = {
  error: {
    message: string;
    details: {
      [key: string]: string[];
    };
  };
} | undefined;