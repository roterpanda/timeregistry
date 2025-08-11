

export interface Project {
  name: string;
  description: string;
  project_code: string;
  isOwnProject: boolean;
}

export interface ProjectListProps {
  limit?: number;
  onlyShowOwnProjects?: boolean;
  showSearchInput?: boolean;
}

export type ErrorResponse = {
  error: {
    message: string;
    details: {
      [key: string]: string[];
    };
  };
} | undefined;