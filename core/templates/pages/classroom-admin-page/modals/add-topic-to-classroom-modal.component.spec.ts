// Copyright 2022 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tests for adding topics to classroom modal.
 */

import {HttpClientTestingModule} from '@angular/common/http/testing';
import {fakeAsync, tick} from '@angular/core/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {EditableTopicBackendApiService} from 'domain/topic/editable-topic-backend-api.service';
import {AddTopicToClassroomModalComponent} from './add-topic-to-classroom-modal.component';
import {LoadingDotsComponent} from 'components/common-layout-directives/common-elements/loading-dots.component';

describe('AddTopicToClassroomModalComponent', () => {
  let fixture: ComponentFixture<AddTopicToClassroomModalComponent>;
  let componentInstance: AddTopicToClassroomModalComponent;
  let ngbActiveModal: NgbActiveModal;
  let editableTopicBackendApiService: EditableTopicBackendApiService;
  let formBuilder: FormBuilder;
  let closeSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddTopicToClassroomModalComponent, LoadingDotsComponent],
      providers: [NgbActiveModal, FormBuilder, EditableTopicBackendApiService],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTopicToClassroomModalComponent);
    componentInstance = fixture.componentInstance;
    ngbActiveModal = TestBed.inject(NgbActiveModal);
    formBuilder = TestBed.inject(FormBuilder);
    editableTopicBackendApiService = TestBed.inject(
      EditableTopicBackendApiService
    );
    closeSpy = spyOn(ngbActiveModal, 'close').and.callThrough();
  });

  it('should create the component', () => {
    expect(componentInstance).toBeDefined();
  });

  it('should be able to close modal', () => {
    spyOn(ngbActiveModal, 'dismiss');
    componentInstance.close();
    expect(ngbActiveModal.dismiss).toHaveBeenCalled();
  });

  it('should initialize form and fetch unused topics on init', fakeAsync(() => {
    spyOn(
      editableTopicBackendApiService,
      'getUnusedTopicsAsync'
    ).and.returnValue(Promise.resolve({}));

    componentInstance.ngOnInit();
    tick();

    expect(componentInstance.topicBackendDictList).toBeDefined();
    expect(componentInstance.topicForm).toBeDefined();
    expect(
      editableTopicBackendApiService.getUnusedTopicsAsync
    ).toHaveBeenCalled();
  }));

  it('should submit form and close modal with selected topic', fakeAsync(() => {
    const mockTopic = {
      id: 'topic1',
      name: 'Topic 1',
      description: 'Description of Topic 1',
    };
    componentInstance.topicBackendDictList = [mockTopic];
    componentInstance.topicForm = formBuilder.group({
      topicId: [mockTopic.id],
    });

    componentInstance.addTopics();
    expect(closeSpy).toHaveBeenCalledWith(['topicId']);
  }));
});
