import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the Tag interface
export interface Tag {
  id: string;
  name: string;
  color: string;
  type: 'project' | 'context' | 'lifearea'; // Type of tag for filtering purposes
}

// Define the context interface
interface TagContextType {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  getTagById: (id: string) => Tag | undefined;
  getTagsByType: (type: Tag['type']) => Tag[];
}

// Create the context with a default value
const TagContext = createContext<TagContextType | undefined>(undefined);

// Define props for the provider component
interface TagProviderProps {
  children: ReactNode;
}

// Create a provider component
export const TagProvider: React.FC<TagProviderProps> = ({ children }) => {
  // State to store tags
  const [tags, setTags] = useState<Tag[]>(() => {
    // Initialize from localStorage if available
    const storedTags = localStorage.getItem('tags');
    return storedTags ? JSON.parse(storedTags) : [
      // Default tags as examples
      { id: '1', name: 'Work', color: '#ff79c6', type: 'project' },
      { id: '2', name: 'Personal', color: '#8be9fd', type: 'project' },
      { id: '3', name: 'Home', color: '#f1fa8c', type: 'context' },
      { id: '4', name: 'Office', color: '#bd93f9', type: 'context' },
      { id: '5', name: 'Health', color: '#50fa7b', type: 'lifearea' },
      { id: '6', name: 'Finance', color: '#ff5555', type: 'lifearea' },
    ];
  });

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Add a new tag
  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(), // Simple ID generation
    };
    setTags([...tags, newTag]);
  };

  // Update an existing tag
  const updateTag = (updatedTag: Tag) => {
    setTags(tags.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
  };

  // Delete a tag
  const deleteTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  // Get a tag by ID
  const getTagById = (id: string) => {
    return tags.find(tag => tag.id === id);
  };

  // Get tags by type
  const getTagsByType = (type: Tag['type']) => {
    return tags.filter(tag => tag.type === type);
  };

  // Create the context value object
  const contextValue: TagContextType = {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagsByType,
  };

  return (
    <TagContext.Provider value={contextValue}>
      {children}
    </TagContext.Provider>
  );
};

// Custom hook to use the tag context
export const useTags = () => {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagProvider');
  }
  return context;
};