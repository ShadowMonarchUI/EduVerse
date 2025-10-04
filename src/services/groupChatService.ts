import { database, ref, set, push, onValue, off, update, remove } from './firebase';
import type { User } from '../contexts/UserContext';

export interface Group {
  id: string;
  name: string;
  members: string[]; // User IDs
  createdAt: number; // Timestamp
  createdBy: string; // User ID
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number; // Timestamp
}

export interface GroupMember {
  userId: string;
  userName: string;
  lastSeen: number;
  isOnline: boolean;
}

// Create a new group
export const createGroup = async (groupName: string, currentUser: User): Promise<Group> => {
  try {
    // Create group reference
    const newGroupRef = push(ref(database, 'groups'));
    const groupId = newGroupRef.key;
    
    if (!groupId) {
      throw new Error('Failed to generate group ID');
    }
    
    // Create group data
    const groupData: Group = {
      id: groupId,
      name: groupName,
      members: [currentUser.id],
      createdAt: Date.now(),
      createdBy: currentUser.id
    };
    
    // Save group to database
    await set(newGroupRef, groupData);
    
    // Add user to group members with presence info
    const memberData: GroupMember = {
      userId: currentUser.id,
      userName: currentUser.name,
      lastSeen: Date.now(),
      isOnline: true
    };
    
    await set(ref(database, `groupMembers/${groupId}/${currentUser.id}`), memberData);
    
    return groupData;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

// Join a group
export const joinGroup = async (groupId: string, currentUser: User): Promise<void> => {
  try {
    // Get group reference
    const groupRef = ref(database, `groups/${groupId}`);
    
    // Listen for group data once
    const groupSnapshot = await new Promise<any>((resolve, reject) => {
      const unsubscribe = onValue(groupRef, (snapshot) => {
        resolve(snapshot);
        unsubscribe();
      }, reject);
    });
    
    if (!groupSnapshot.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupSnapshot.val();
    
    // Check if user is already a member
    if (groupData.members.includes(currentUser.id)) {
      return; // User is already a member
    }
    
    // Add user to members list
    const updatedMembers = [...groupData.members, currentUser.id];
    
    // Update group members
    await set(ref(database, `groups/${groupId}/members`), updatedMembers);
    
    // Add user to group members with presence info
    const memberData: GroupMember = {
      userId: currentUser.id,
      userName: currentUser.name,
      lastSeen: Date.now(),
      isOnline: true
    };
    
    await set(ref(database, `groupMembers/${groupId}/${currentUser.id}`), memberData);
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

// Leave a group
export const leaveGroup = async (groupId: string, currentUser: User): Promise<void> => {
  try {
    // Get group reference
    const groupRef = ref(database, `groups/${groupId}`);
    
    // Listen for group data once
    const groupSnapshot = await new Promise<any>((resolve, reject) => {
      const unsubscribe = onValue(groupRef, (snapshot) => {
        resolve(snapshot);
        unsubscribe();
      }, reject);
    });
    
    if (!groupSnapshot.exists()) {
      throw new Error('Group not found');
    }
    
    const groupData = groupSnapshot.val();
    
    // Remove user from members list
    const updatedMembers = groupData.members.filter((memberId: string) => memberId !== currentUser.id);
    
    // Update group members
    await set(ref(database, `groups/${groupId}/members`), updatedMembers);
    
    // Remove user from group members
    await remove(ref(database, `groupMembers/${groupId}/${currentUser.id}`));
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

// Send a message to a group
export const sendMessage = async (groupId: string, message: string, currentUser: User): Promise<Message> => {
  try {
    // Create message reference
    const newMessageRef = push(ref(database, `messages/${groupId}`));
    const messageId = newMessageRef.key;
    
    if (!messageId) {
      throw new Error('Failed to generate message ID');
    }
    
    // Create message data
    const messageData: Message = {
      id: messageId,
      groupId,
      userId: currentUser.id,
      userName: currentUser.name,
      content: message,
      timestamp: Date.now()
    };
    
    // Save message to database
    await set(newMessageRef, messageData);
    
    // Update user's last seen
    await update(ref(database, `groupMembers/${groupId}/${currentUser.id}`), {
      lastSeen: Date.now()
    });
    
    return messageData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Listen for group messages
export const listenForMessages = (groupId: string, callback: (messages: Message[]) => void): (() => void) => {
  const messagesRef = ref(database, `messages/${groupId}`);
  
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      const messages: Message[] = Object.keys(messagesData).map(key => ({
        ...messagesData[key],
        id: key
      })).sort((a, b) => a.timestamp - b.timestamp);
      
      callback(messages);
    } else {
      callback([]);
    }
  });
  
  return () => off(messagesRef, 'value', unsubscribe);
};

// Listen for groups
export const listenForGroups = (callback: (groups: Group[]) => void): (() => void) => {
  const groupsRef = ref(database, 'groups');
  
  const unsubscribe = onValue(groupsRef, (snapshot) => {
    if (snapshot.exists()) {
      const groupsData = snapshot.val();
      const groups: Group[] = Object.keys(groupsData).map(key => ({
        ...groupsData[key],
        id: key
      }));
      
      callback(groups);
    } else {
      callback([]);
    }
  });
  
  return () => off(groupsRef, 'value', unsubscribe);
};

// Listen for group members
export const listenForGroupMembers = (groupId: string, callback: (members: GroupMember[]) => void): (() => void) => {
  const membersRef = ref(database, `groupMembers/${groupId}`);
  
  const unsubscribe = onValue(membersRef, (snapshot) => {
    if (snapshot.exists()) {
      const membersData = snapshot.val();
      const members: GroupMember[] = Object.keys(membersData).map(key => ({
        ...membersData[key],
        userId: key
      }));
      
      callback(members);
    } else {
      callback([]);
    }
  });
  
  return () => off(membersRef, 'value', unsubscribe);
};

// Update user presence
export const updateUserPresence = async (groupId: string, userId: string, isOnline: boolean): Promise<void> => {
  try {
    await update(ref(database, `groupMembers/${groupId}/${userId}`), {
      isOnline,
      lastSeen: Date.now()
    });
  } catch (error) {
    console.error('Error updating user presence:', error);
    throw error;
  }
};

// Get group members
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const membersRef = ref(database, `groupMembers/${groupId}`);
    
    const snapshot = await new Promise<any>((resolve, reject) => {
      const unsubscribe = onValue(membersRef, (snapshot) => {
        resolve(snapshot);
        unsubscribe();
      }, reject);
    });
    
    if (snapshot.exists()) {
      const membersData = snapshot.val();
      const members: GroupMember[] = Object.keys(membersData).map(key => ({
        ...membersData[key],
        userId: key
      }));
      
      return members;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting group members:', error);
    throw error;
  }
};