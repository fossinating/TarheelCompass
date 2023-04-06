import { SectionData } from "./Common";

export class ScheduleManager {
    class_numbers : Array<number> = [];

    addClass(section_data: SectionData): void {
        this.class_numbers.push(section_data.class_number);
    }
    removeClass(section_data: SectionData): void {
        this.class_numbers = this.class_numbers.filter(e => e !== section_data.class_number);
    }

    checkClass(section_data: SectionData): boolean {
        return this.class_numbers.indexOf(section_data.class_number) > -1;
    }

    checkConflicts(section_data: SectionData): boolean {
        return !this.checkClass(section_data);
    }
}