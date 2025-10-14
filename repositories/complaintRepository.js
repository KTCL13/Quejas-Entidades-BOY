import { Complaint } from '../models/Complaint.js';
import { Entity } from '../models/Entity.js';

export async function findComplaintById(complaintId) {
  try {
    const complaint = await Complaint.findOne({
      where: { id: complaintId, is_deleted: false },
      include: [{
        model: Entity,
        attributes: ['id', 'name']
      }],
    });
    return complaint;
  } catch (error) {
    console.error('Error en ComplaintRepository.findComplaintById:', error);
    throw error;
  }
}