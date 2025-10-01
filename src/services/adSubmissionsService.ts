/**
 * Firebase service for Ad Submissions
 * Provides real-time CRUD operations for ad submissions
 */
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  QuerySnapshot,
  DocumentSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AdSubmission, AdStatus, AdCategory } from '../types/admin';

// Collection name
const COLLECTION_NAME = 'ad_submissions';

// Convert Firestore timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Date to Firestore timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Convert Firestore document to AdSubmission
const documentToAdSubmission = (doc: DocumentSnapshot): AdSubmission | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    category: data.category,
    islandId: data.islandId,
    status: data.status,
    submittedBy: data.submittedBy,
    submittedAt: timestampToDate(data.submittedAt),
    reviewedAt: data.reviewedAt ? timestampToDate(data.reviewedAt) : undefined,
    reviewedBy: data.reviewedBy || undefined,
    data: data.submissionData || {},
    notes: data.notes || undefined,
  };
};

// Convert AdSubmission to Firestore document
const adSubmissionToDocument = (submission: Partial<AdSubmission>) => {
  const doc: any = {
    title: submission.title,
    category: submission.category,
    islandId: submission.islandId,
    status: submission.status,
    submittedBy: submission.submittedBy,
    submissionData: submission.data,
  };

  if (submission.submittedAt) {
    doc.submittedAt = dateToTimestamp(submission.submittedAt);
  }
  
  if (submission.reviewedAt) {
    doc.reviewedAt = dateToTimestamp(submission.reviewedAt);
  }
  
  if (submission.reviewedBy) {
    doc.reviewedBy = submission.reviewedBy;
  }
  
  if (submission.notes) {
    doc.notes = submission.notes;
  }

  return doc;
};

export class AdSubmissionsService {
  /**
   * Create a new ad submission
   */
  static async createSubmission(submission: Omit<AdSubmission, 'id'>): Promise<string> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docData = adSubmissionToDocument({
        ...submission,
        submittedAt: new Date(),
      });

      const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating ad submission:', error);
      throw error;
    }
  }

  /**
   * Update an existing ad submission
   */
  static async updateSubmission(id: string, updates: Partial<AdSubmission>): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docData = adSubmissionToDocument(updates);
      
      await updateDoc(docRef, docData);
    } catch (error) {
      console.error('Error updating ad submission:', error);
      throw error;
    }
  }

  /**
   * Delete an ad submission
   */
  static async deleteSubmission(id: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting ad submission:', error);
      throw error;
    }
  }

  /**
   * Get a single ad submission by ID
   */
  static async getSubmission(id: string): Promise<AdSubmission | null> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      return documentToAdSubmission(docSnap);
    } catch (error) {
      console.error('Error getting ad submission:', error);
      throw error;
    }
  }

  /**
   * Get all ad submissions (one-time fetch)
   */
  static async getAllSubmissions(): Promise<AdSubmission[]> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const submissions: AdSubmission[] = [];
      
      querySnapshot.forEach((doc) => {
        const submission = documentToAdSubmission(doc);
        if (submission) {
          submissions.push(submission);
        }
      });
      
      return submissions;
    } catch (error) {
      console.error('Error getting all ad submissions:', error);
      throw error;
    }
  }

  /**
   * Real-time listener for all ad submissions
   */
  static onSubmissionsSnapshot(
    callback: (submissions: AdSubmission[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const submissions: AdSubmission[] = [];
        
        querySnapshot.forEach((doc) => {
          const submission = documentToAdSubmission(doc);
          if (submission) {
            submissions.push(submission);
          }
        });
        
        callback(submissions);
      },
      (error) => {
        console.error('Error in submissions snapshot listener:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  }

  /**
   * Real-time listener for submissions by status
   */
  static onSubmissionsByStatusSnapshot(
    status: AdStatus,
    callback: (submissions: AdSubmission[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', status),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const submissions: AdSubmission[] = [];
        
        querySnapshot.forEach((doc) => {
          const submission = documentToAdSubmission(doc);
          if (submission) {
            submissions.push(submission);
          }
        });
        
        callback(submissions);
      },
      (error) => {
        console.error('Error in status-filtered submissions snapshot listener:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  }

  /**
   * Real-time listener for submissions by island
   */
  static onSubmissionsByIslandSnapshot(
    islandId: string,
    callback: (submissions: AdSubmission[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    const q = query(
      collection(db, COLLECTION_NAME),
      where('islandId', '==', islandId),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const submissions: AdSubmission[] = [];
        
        querySnapshot.forEach((doc) => {
          const submission = documentToAdSubmission(doc);
          if (submission) {
            submissions.push(submission);
          }
        });
        
        callback(submissions);
      },
      (error) => {
        console.error('Error in island-filtered submissions snapshot listener:', error);
        if (onError) {
          onError(error);
        }
      }
    );
  }

  /**
   * Approve a submission (with reviewer info)
   */
  static async approveSubmission(
    id: string, 
    reviewedBy: string, 
    notes?: string
  ): Promise<void> {
    const updates: Partial<AdSubmission> = {
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy,
      notes,
    };

    await this.updateSubmission(id, updates);
  }

  /**
   * Reject a submission (with reviewer info and required notes)
   */
  static async rejectSubmission(
    id: string, 
    reviewedBy: string, 
    notes: string
  ): Promise<void> {
    const updates: Partial<AdSubmission> = {
      status: 'rejected',
      reviewedAt: new Date(),
      reviewedBy,
      notes,
    };

    await this.updateSubmission(id, updates);
  }

  /**
   * Get submission statistics
   */
  static async getSubmissionStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    if (!db) {
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }

    try {
      const allSubmissions = await this.getAllSubmissions();
      
      const stats = {
        total: allSubmissions.length,
        pending: allSubmissions.filter(s => s.status === 'pending').length,
        approved: allSubmissions.filter(s => s.status === 'approved').length,
        rejected: allSubmissions.filter(s => s.status === 'rejected').length,
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting submission stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }

  /**
   * Real-time listener for submission statistics
   */
  static onSubmissionStatsSnapshot(
    callback: (stats: { total: number; pending: number; approved: number; rejected: number }) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return this.onSubmissionsSnapshot(
      (submissions) => {
        const stats = {
          total: submissions.length,
          pending: submissions.filter(s => s.status === 'pending').length,
          approved: submissions.filter(s => s.status === 'approved').length,
          rejected: submissions.filter(s => s.status === 'rejected').length,
        };
        callback(stats);
      },
      onError
    );
  }

  /**
   * Batch approve multiple submissions
   */
  static async batchApproveSubmissions(
    ids: string[], 
    reviewedBy: string
  ): Promise<void> {
    if (!db) {
      throw new Error('Firebase not initialized');
    }

    try {
      const batch = writeBatch(db);
      const now = new Date();

      ids.forEach((id) => {
        if (!db) {
            throw new Error('Database not available');
        }
        const docRef = doc(db, COLLECTION_NAME, id);
        batch.update(docRef, {
          status: 'approved',
          reviewedAt: dateToTimestamp(now),
          reviewedBy,
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error batch approving submissions:', error);
      throw error;
    }
  }
}

export default AdSubmissionsService;